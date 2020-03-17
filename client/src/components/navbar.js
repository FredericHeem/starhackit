/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createElement as h } from "react";
import drawer from "mdlean/lib/drawer";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import styled from "@emotion/styled";
import button from "mdlean/lib/button";
import menu from "./menu";
import appBarView from "components/appBarView";
import titleView from "components/titleView";

export default context => {
  const {
    history,
    theme: {palette},
    config: { defaultPath, title }
  } = context;
  const AppBarView = appBarView(context);
  const Drawer = drawer(context);
  const Menu = menu(context);
  const store = observable({
    drawerOpen: false,
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    closeDrawer() {
      store.drawerOpen = false;
    },
    navChange: action(function(menuItem) {
      history.push(menuItem.route);
    })
  });

  const BurgerButton = styled(button(context))({
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
          fill={palette.primary.contrastText}
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
        />
      </svg>
    );
  }

  const IconLeft = ({ onDrawerClick }) => (
    <BurgerButton aria-label="Open Menu" ripple onClick={onDrawerClick}>
      <BurgerIcon />
    </BurgerButton>
  );

  const TitleView = titleView(context)(button(context));

  const NavBar = observer(({ right, appMenu }) => {
    return (
      <header>
        <AppBarView>
          <div
            css={{
              display: "flex",
              justifyContent: "flex-start",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            {appMenu && <IconLeft onDrawerClick={() => store.toggleDrawer()} />}
            <TitleView
              onClick={() => store.navChange({ route: defaultPath })}
              label={title}
            />
          </div>
          {right && h(right)}
        </AppBarView>
        {appMenu && (
          <Drawer open={store.drawerOpen} onClose={() => store.closeDrawer()}>
            <Menu
              menuItems={appMenu}
              navChange={item => store.navChange(item)}
            />
          </Drawer>
        )}
      </header>
    );
  });

  return props => <NavBar {...props} />;
};
