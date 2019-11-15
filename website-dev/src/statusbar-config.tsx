import React from "react";
import { Menus } from "@deer-ui/core";

const menusForUser = options => {
  const { hide, logout } = options;
  return (
    <Menus
      data={[
        {
          text: "Setting",
          action: () => {
            hide();
          }
        },
        {
          text: "Profile",
          action: () => {}
        },
        "-",
        {
          text: "Logout",
          action: () => {
            hide();
            logout();
          }
        }
      ]}
    />
  );
};

const menusForTask = ({ hide }) => {
  return (
    <Menus
      data={[
        {
          text: "Github",
          pureIcon: "fab fa-github",
          action: () => {
            hide();
            window.open("https://github.com/minimal-studio/admin-dashboard.git");
          }
        },
        {
          text: "Blog",
          icon: "rss-square",
          action: () => {
            hide();
            window.open("https://thinkmore.xyz");
          }
        },
        {
          text: "About",
          icon: "assistive-listening-systems",
          action: () => {
            hide();
            window.open("https://thinkmore.xyz");
          }
        }
      ]}
    />
  );
};

const menusForComment = ({ hide }) => {
  return (
    <Menus
      data={[
        {
          text: "Item1",
          action: () => {
            hide();
          }
        },
        {
          text: "Item2",
          action: () => {}
        },
        {
          text: "Item3",
          action: () => {}
        }
      ]}
    />
  );
};

const statusbarConfig = [
  {
    title: "",
    icon: "user",
    overlay: menusForUser
  },
  {
    title: "",
    icon: "comment",
    overlay: menusForComment
  },
  {
    title: "",
    icon: "tasks",
    overlay: menusForTask
  }
];

export default statusbarConfig;
