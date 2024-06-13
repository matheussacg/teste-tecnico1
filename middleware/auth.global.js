import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const token = localStorage.getItem("token");

    // Se o usuário estiver logado e tentar acessar a página de login, redirecione para a página inicial
    if (token && isTokenValid(token) && to.path === "/login") {
      return navigateTo("/");
    }

    // Se o usuário não estiver logado e tentar acessar uma rota privada, redirecione para a página de login
    if (!token && !isPublicRoute(to.path)) {
      return navigateTo("/login");
    }

    // Se o token for inválido e o usuário tentar acessar uma rota privada, redirecione para a página de login
    if (token && !isTokenValid(token) && !isPublicRoute(to.path)) {
      return navigateTo("/login");
    }
  }

  function isPublicRoute(routePath) {
    const publicRoutes = ["/login", "/register"];
    return publicRoutes.includes(routePath);
  }

  function isTokenValid(token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate > new Date();
    } catch (error) {
      console.log('Token inválido');
      return false;
    }
  }
});
