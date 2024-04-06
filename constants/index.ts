export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Главная",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Поиск",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Уведомление",
  },
  {
    imgURL: "/assets/create.svg",
    route: "/create-post",
    label: "Создать запись",
  },
  {
    imgURL: "/assets/community.svg",
    route: "/communities",
    label: "Сообщества",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Профиль",
  },
];

export const profileTabs = [
  { value: "cv", label: "Portfolio", icon: "/assets/user.svg" },
  { value: "comments", label: "Comments", icon: "/assets/members.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];
