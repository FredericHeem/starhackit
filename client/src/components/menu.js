import * as React from "react";
import glamorous from "glamorous";
import button from "mdlean/lib/button";

export default context => {
  const MenuItemView = glamorous("div")({
    width: "100%",
    minWidth: 150
  });

  function MenuItem({ menu, navChange }) {
    const Button = button(context);
    return (
      <MenuItemView>
        <Button
          style={{ width: "100%", justifyContent: "flex-start" }}
          label={menu.text}
          onClick={() => navChange(menu)}
        />
      </MenuItemView>
    );
  }

  const MenuView = glamorous("div")({
    padding: 0
  });

  function Menu({ menuItems = [], navChange, css }) {
    return (
      <MenuView css={css}>
        {menuItems.map((menu, key) => (
          <MenuItem navChange={navChange} menu={menu} key={key} />
        ))}
      </MenuView>
    );
  }
  return Menu;
};
