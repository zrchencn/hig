import React, { Component } from "react";

import { ThemeContext } from "@hig/theme-context";
import TreeItemBehavior from "../../behaviors/TreeItemBehavior";

import { NestedSubTreeItem, SubTreeItem } from "./NestedSubTreeItem";

class TreeObjectView extends Component {
  render() {
    const {
      tree: {
        id,
        payload,
        payload: { getActiveTreeItemId, getKeyboardOpenId, setKeyboardOpenId },
        meta: { collapsed }
      },
      ...otherProps
    } = this.props;
    const { onFocus } = otherProps;

    return (
      <TreeItemBehavior
        {...otherProps}
        id={id}
        payload={payload}
        collapsed={collapsed}
        defaultCollapsed
      >
        {({
          getIsCollapsed,
          handleClick,
          handleMouseEnter,
          handleMouseLeave,
          setIsCollapsed
        }) => (
          <ThemeContext.Consumer>
            {({ resolvedRoles, metadata }) => {
              return (
                this.props.tree.children ? 
                  (
                    <NestedSubTreeItem
                      density={metadata.densityId}
                      treeItem={this.props.tree}
                      themeData={resolvedRoles}
                      onClick={handleClick}
                      onFocus={onFocus}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      selected={getActiveTreeItemId() === id}
                      collapsed={getIsCollapsed()}
                      getIsCollapsed={getIsCollapsed}
                      getKeyboardOpenId={getKeyboardOpenId}
                      keyboardOpenId={getKeyboardOpenId()}
                      setIsCollapsed={setIsCollapsed}
                      setKeyboardOpenId={setKeyboardOpenId}
                    />
                  ) : (
                    <SubTreeItem
                      density={metadata.densityId}
                      treeItem={{ ...this.props.tree, payload }}
                      themeData={resolvedRoles}
                      onClick={handleClick}
                      onFocus={onFocus}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      selected={getActiveTreeItemId() === id}
                      collapsed={getIsCollapsed()}
                      getIsCollapsed={getIsCollapsed}
                      getKeyboardOpenId={getKeyboardOpenId}
                      keyboardOpenId={getKeyboardOpenId()}
                      setIsCollapsed={setIsCollapsed}
                      setKeyboardOpenId={setKeyboardOpenId}
                    />
                  )
              );
            }}
          </ThemeContext.Consumer>
        )}
      </TreeItemBehavior>
    );
  }
}

export default TreeObjectView;
