import * as React from "react";
import glamorous from "glamorous";
import drawer from "mdlean/lib/drawer";
import config from "config";
import {observable, action} from "mobx";
import { observer } from "mobx-react";
import menu from "./menu";
import button from "mdlean/lib/button";

export default context => {
  const { tr, theme, parts } = context;
  const {palette} = theme;
  const Drawer = drawer(context);
  const Menu = menu(context);
  const store = observable({
    open: false,
    toggle() {
      this.open = !this.open;
    },
    close() {
      store.open = false;
    },
    navChange: action(function(menuItem) {
      context.history.push(menuItem.route);
      this.open = false;
    })
  });

  const BurgerButton = glamorous(button(context))({
    height: 50,
    width: 50
  });

  function BurgerIcon() {
    return (
      <svg
        id="burger-icon"
        version="1.1"
        viewBox="0 0 32 32"
        width="40px"
        height="40px"
      >
        <path
          fill={theme.palette.textPrimaryOnPrimary}
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
        />
      </svg>
    );
  }

  function IconLeft({ onDrawerClick }) {
    return (
      <BurgerButton ripple onClick={onDrawerClick}>
        <BurgerIcon />
      </BurgerButton>
    );
  }

  const TitleView = glamorous(button(context))(() => ({
    fontSize: 34,
    fontWeight: "bold",
    margin: 10,
    color: palette.textPrimaryOnPrimary
  }));

  const AppBarView = glamorous("div")(() => ({
    height: 80,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: palette.primary,
    color: palette.textPrimaryOnPrimary
  }));

  function AppBar({ onDrawerClick, onTitleClick }) {
    return (
      <AppBarView>
        <IconLeft onDrawerClick={onDrawerClick} />
        <TitleView onClick={onTitleClick} label={tr.t(config.title)} />
      </AppBarView>
    );
  }

  function themeSideBar(){
    parts.theme.stores().sideBar.toogle()
    store.toggle();
  }

  function NavBar({ authenticated }) {
    return (
      <header>
        <AppBar
          onDrawerClick={() => store.toggle()}
          onTitleClick={() => store.navChange({ route: "/" })}
        />
        <Drawer open={store.open} onClose={() => store.close()}>
          <Menu
            authenticated={authenticated}
            navChange={item => store.navChange(item)}
            themeSideBar={themeSideBar}
          />
        </Drawer>
      </header>
    );
  }

  return observer(NavBar);
};
