/*eslint-disable*/
import React, { Component } from 'react';
import ReactNative, {
  AppRegistry,
  NativeModules,
  // PixelRatio,
  processColor
} from 'react-native';
import _ from 'lodash';
import PropRegistry from './../PropRegistry';

import Navigation from './../Navigation';

import * as newPlatformSpecific from './../platformSpecific';

/** 
/* for android we need to hack a little bit:
/* we will convert font to scheme like font://fontName:fontSize:color:glyph
**/
// const scale = Math.floor(PixelRatio.get());
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
const resolveAssetSourceUri = source => {
  if (source.fontName) {
    return `font://${source.fontName}:${source.fontSize}:${source.color}:${
      source.glyph
    }`;
  }
  return resolveAssetSource(source).uri;
};

async function startSingleScreenApp(params) {
  const components = params.components;
  if (!params.screen && !components) {
    console.error(
      'startSingleScreenApp(params): screen must include a screen property'
    );
    return;
  }

  if (components) {
    params.screen = createSingleScreen(components[0]);
    components.shift();
    params.screen.screens = components.map(createSingleScreen) || [];
    params.screen.screens.map((c, i) =>
      i === 0 ? c : addTitleBarBackButtonIfNeeded(c)
    );
  } else {
    params.screen = createSingleScreen({
      ...params.screen,
      passProps: params.passProps
    });
  }

  params.sideMenu = convertDrawerParamsToSideMenuParams(params.drawer);
  params.overrideBackPress = params.screen.overrideBackPress;
  params.animateShow = convertAnimationType(params.animationType);
  params.appStyle = convertStyleParams(params.appStyle);
  if (params.appStyle) {
    params.appStyle.orientation = getOrientation(params);
  }

  return await newPlatformSpecific.startApp(params);
}

function createSingleScreen(params) {
  let screen = params;
  addNavigatorParams(screen);
  addNavigatorButtons(screen, params.drawer);
  addNavigationStyleParams(screen);
  screen.passProps = params.passProps;
  /*
   * adapt to new API
   */
  adaptTopTabs(screen, screen.navigatorID);
  screen.screenId = screen.screen;
  screen = adaptNavigationStyleToScreenStyle(screen);
  screen = adaptNavigationParams(screen);
  return screen;
}

function getOrientation(params) {
  if (
    params.portraitOnlyMode ||
    _.get(params, 'appStyle.orientation') === 'portrait'
  ) {
    return 'portrait';
  }
  if (
    params.landscaptOnlyMode ||
    _.get(params, 'appStyle.orientation') === 'landscape'
  ) {
    return 'landscape';
  }
  return 'auto';
}

function adaptTopTabs(screen, navigatorID) {
  screen.topTabs = _.cloneDeep(screen.topTabs);
  _.forEach(_.get(screen, 'topTabs'), tab => {
    addNavigatorParams(tab);
    if (navigatorID) {
      tab.navigatorID = navigatorID;
    }
    tab.screen = tab.screenId;
    if (tab.icon) {
      addTabIcon(tab);
    }
    addNavigatorButtons(tab);
    adaptNavigationParams(tab);
    addNavigationStyleParams(tab);
    tab = adaptNavigationStyleToScreenStyle(tab);
  });
}

function navigatorPush(navigator, params) {
  // special case for react-native
  if (params.native) {
    let options = {
      native: params.native,
      navigationParams: {}
    };
    addNavigatorParams(options.navigationParams, navigator);
    return newPlatformSpecific.push(options);
  }

  addNavigatorParams(params, navigator);
  addNavigatorButtons(params);
  addTitleBarBackButtonIfNeeded(params);
  addNavigationStyleParams(params);

  adaptTopTabs(params, params.navigatorID);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.overrideBackPress = params.overrideBackPress;
  adapted.timestamp = Date.now();
  if (!adapted.passProps) {
    adapted.passProps = {};
  }
  if (!adapted.passProps.commandType) {
    adapted.passProps.commandType = 'Push';
  }

  return newPlatformSpecific.push(adapted);
}

function navigatorPop(navigator, params) {
  addNavigatorParams(params, navigator);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.timestamp = Date.now();

  newPlatformSpecific.pop(adapted);
}

function navigatorPopToRoot(navigator, params) {
  addNavigatorParams(params, navigator);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.timestamp = Date.now();

  newPlatformSpecific.popToRoot(adapted);
}

function navigatorPopTo(navigator, params) {
  addNavigatorParams(params, navigator);

  params.screenId = params.screenId;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.timestamp = Date.now();

  newPlatformSpecific.popTo(adapted);
}

function navigatorResetTo(navigator, params) {
  addNavigatorParams(params, navigator);
  addNavigatorButtons(params);
  addNavigationStyleParams(params);

  adaptTopTabs(params, params.navigatorID);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.timestamp = Date.now();

  newPlatformSpecific.newStack(adapted);
}

function adaptNavigationStyleToScreenStyle(screen) {
  const navigatorStyle = screen.navigatorStyle;
  if (!navigatorStyle) {
    return screen;
  }

  screen.styleParams = convertStyleParams(navigatorStyle);

  return _.omit(screen, ['navigatorStyle']);
}

function convertStyleParams(originalStyleObject) {
  if (!originalStyleObject) {
    return null;
  }

  let ret = {
    orientation: originalStyleObject.orientation,
    screenAnimationType: originalStyleObject.screenAnimationType,
    statusBarColor: processColor(originalStyleObject.statusBarColor),
    statusBarHidden: originalStyleObject.statusBarHidden,
    statusBarTextColorScheme: originalStyleObject.statusBarTextColorScheme,
    drawUnderStatusBar: originalStyleObject.drawUnderStatusBar,
    topBarReactView: originalStyleObject.navBarCustomView,
    topBarReactViewAlignment: originalStyleObject.navBarComponentAlignment,
    topBarReactViewInitialProps:
      originalStyleObject.navBarCustomViewInitialProps,
    topBarColor: processColor(originalStyleObject.navBarBackgroundColor),
    topBarTransparent: originalStyleObject.navBarTransparent,
    topBarTranslucent: originalStyleObject.navBarTranslucent,
    topBarElevationShadowEnabled:
      originalStyleObject.topBarElevationShadowEnabled,
    topBarCollapseOnScroll: originalStyleObject.topBarCollapseOnScroll,
    topBarBorderColor: processColor(originalStyleObject.topBarBorderColor),
    topBarBorderWidth:
      originalStyleObject.topBarBorderWidth &&
      `${originalStyleObject.topBarBorderWidth}`,
    collapsingToolBarImage: originalStyleObject.collapsingToolBarImage,
    collapsingToolBarComponent: originalStyleObject.collapsingToolBarComponent,
    collapsingToolBarComponentHeight:
      originalStyleObject.collapsingToolBarComponentHeight,
    collapsingToolBarCollapsedColor: processColor(
      originalStyleObject.collapsingToolBarCollapsedColor
    ),
    collapsingToolBarExpendedColor: processColor(
      originalStyleObject.collapsingToolBarExpendedColor
    ),
    showTitleWhenExpended: originalStyleObject.showTitleWhenExpended,
    expendCollapsingToolBarOnTopTabChange:
      originalStyleObject.expendCollapsingToolBarOnTopTabChange,
    titleBarHidden: originalStyleObject.navBarHidden,
    titleBarHideOnScroll: originalStyleObject.navBarHideOnScroll,
    titleBarTitleColor: processColor(originalStyleObject.navBarTextColor),
    titleBarSubtitleColor: processColor(
      originalStyleObject.navBarSubtitleColor
    ),
    titleBarSubtitleFontSize: originalStyleObject.navBarSubtitleFontSize,
    titleBarSubtitleFontFamily: originalStyleObject.navBarSubtitleFontFamily,
    titleBarButtonColor: processColor(originalStyleObject.navBarButtonColor),
    titleBarButtonFontFamily: originalStyleObject.navBarButtonFontFamily,
    titleBarDisabledButtonColor: processColor(
      originalStyleObject.titleBarDisabledButtonColor
    ),
    titleBarTitleFontFamily: originalStyleObject.navBarTextFontFamily,
    titleBarTitleFontSize: originalStyleObject.navBarTextFontSize,
    titleBarTitleFontBold: originalStyleObject.navBarTextFontBold,
    titleBarTitleTextCentered: originalStyleObject.navBarTitleTextCentered,
    titleBarSubTitleTextCentered:
      originalStyleObject.navBarSubTitleTextCentered,
    titleBarHeight: originalStyleObject.navBarHeight,
    titleBarTopPadding: originalStyleObject.navBarTopPadding,
    backButtonHidden: originalStyleObject.backButtonHidden,
    topTabsHidden: originalStyleObject.topTabsHidden,
    contextualMenuStatusBarColor: processColor(
      originalStyleObject.contextualMenuStatusBarColor
    ),
    contextualMenuBackgroundColor: processColor(
      originalStyleObject.contextualMenuBackgroundColor
    ),
    contextualMenuButtonsColor: processColor(
      originalStyleObject.contextualMenuButtonsColor
    ),

    drawBelowTopBar: !originalStyleObject.drawUnderNavBar,

    topTabTextColor: processColor(originalStyleObject.topTabTextColor),
    topTabTextFontFamily: originalStyleObject.topTabTextFontFamily,
    topTabIconColor: processColor(originalStyleObject.topTabIconColor),
    selectedTopTabIconColor: processColor(
      originalStyleObject.selectedTopTabIconColor
    ),
    selectedTopTabTextColor: processColor(
      originalStyleObject.selectedTopTabTextColor
    ),
    selectedTopTabIndicatorHeight:
      originalStyleObject.selectedTopTabIndicatorHeight,
    selectedTopTabIndicatorColor: processColor(
      originalStyleObject.selectedTopTabIndicatorColor
    ),
    topTabsScrollable: originalStyleObject.topTabsScrollable,
    topTabsHeight: originalStyleObject.topTabsHeight,
    screenBackgroundColor: processColor(
      originalStyleObject.screenBackgroundColor
    ),
    rootBackgroundImageName: originalStyleObject.rootBackgroundImageName,

    drawScreenAboveBottomTabs: !originalStyleObject.drawUnderTabBar,

    initialTabIndex: originalStyleObject.initialTabIndex,
    bottomTabsColor: processColor(originalStyleObject.tabBarBackgroundColor),
    bottomTabsButtonColor: processColor(originalStyleObject.tabBarButtonColor),
    bottomTabsSelectedButtonColor: processColor(
      originalStyleObject.tabBarSelectedButtonColor
    ),
    bottomTabsHidden: originalStyleObject.tabBarHidden,
    bottomTabsHiddenOnScroll: originalStyleObject.bottomTabsHiddenOnScroll,
    bottomTabsHideShadow: originalStyleObject.tabBarHideShadow,
    forceTitlesDisplay: originalStyleObject.forceTitlesDisplay,
    bottomTabBadgeTextColor: processColor(
      originalStyleObject.bottomTabBadgeTextColor
    ),
    bottomTabBadgeBackgroundColor: processColor(
      originalStyleObject.bottomTabBadgeBackgroundColor
    ),
    bottomTabFontFamily: originalStyleObject.tabFontFamily,
    bottomTabFontSize: originalStyleObject.tabFontSize,
    bottomTabSelectedFontSize: originalStyleObject.selectedTabFontSize,

    navigationBarColor: processColor(originalStyleObject.navigationBarColor)
  };

  if (originalStyleObject.disabledButtonColor) {
    ret.titleBarDisabledButtonColor = processColor(
      originalStyleObject.disabledButtonColor
    );
  }

  if (originalStyleObject.collapsingToolBarImage) {
    ret.collapsingToolBarImage = _.isString(
      originalStyleObject.collapsingToolBarImage
    )
      ? originalStyleObject.collapsingToolBarImage
      : resolveAssetSourceUri(originalStyleObject.collapsingToolBarImage);

    // const collapsingToolBarImage = resolveAssetSource(
    //   originalStyleObject.collapsingToolBarImage
    // );
    // if (collapsingToolBarImage) {
    //   ret.collapsingToolBarImage = collapsingToolBarImage.uri;
    // }
  }
  if (_.isUndefined(ret.expendCollapsingToolBarOnTopTabChange)) {
    ret.expendCollapsingToolBarOnTopTabChange = true;
  }
  if (ret.topBarReactViewInitialProps) {
    const passPropsKey = _.uniqueId('customNavBarComponent');
    PropRegistry.save(passPropsKey, ret.topBarReactViewInitialProps);
    ret.topBarReactViewInitialProps = { passPropsKey };
  }
  return ret;
}

function convertDrawerParamsToSideMenuParams(drawerParams) {
  const drawer = Object.assign({}, drawerParams);

  let result = {
    left: {},
    right: {}
  };

  Object.keys(result).forEach(key => {
    if (drawer[key] && drawer[key].screen) {
      result[key].screenId = drawer[key].screen;
      addNavigatorParams(result[key]);
      result[key] = adaptNavigationParams(result[key]);
      result[key].passProps = drawer[key].passProps;
      if (drawer.disableOpenGesture) {
        result[key].disableOpenGesture = parseInt(drawer.disableOpenGesture);
      } else {
        let fixedWidth = drawer[key].disableOpenGesture;
        result[key].disableOpenGesture = fixedWidth
          ? parseInt(fixedWidth)
          : null;
      }
      if (drawer.fixedWidth) {
        result[key].fixedWidth = drawer.fixedWidth;
      } else {
        result[key].fixedWidth = drawer[key].fixedWidth;
      }
    } else {
      result[key] = null;
    }
  });

  return result;
}

function adaptNavigationParams(screen) {
  screen.navigationParams = {
    screenInstanceID: screen.screenInstanceID,
    navigatorID: screen.navigatorID,
    navigatorEventID: screen.navigatorEventID
  };
  return screen;
}

async function startTabBasedApp(params) {
  if (!params.tabs) {
    console.error('startTabBasedApp(params): params.tabs is required');
    return;
  }

  const newTabs = [];

  params.tabs = _.cloneDeep(params.tabs);

  params.tabs.forEach(function(tab, idx) {
    if (tab.components) {
      const components = tab.components;
      let screen = createBottomTabScreen(tab, idx, params);
      const { label, icon, selectedIcon } = screen;
      screen.screens = components.map(c =>
        createBottomTabScreen({ ...c, icon, selectedIcon, label }, idx, params)
      );
      screen.screens.map((s, i) => addTitleBarBackButtonIfNeeded(s));
      screen.screens.map(
        (s, i) =>
          (s.navigationParams.navigatorID = screen.navigationParams.navigatorID)
      );
      screen = _.omit(screen, ['components']);
      newTabs.push(screen);
    } else {
      newTabs.push(createBottomTabScreen(tab, idx, params));
    }
  });
  params.tabs = newTabs;

  params.appStyle = convertStyleParams(params.appStyle);
  if (params.appStyle) {
    params.appStyle.orientation = getOrientation(params);
  }
  params.sideMenu = convertDrawerParamsToSideMenuParams(params.drawer);
  params.animateShow = convertAnimationType(params.animationType);

  return await newPlatformSpecific.startApp(params);
}

function createBottomTabScreen(tab, idx, params) {
  addNavigatorParams(tab, null, idx);
  addNavigatorButtons(tab, params.drawer);
  addNavigationStyleParams(tab);
  addTabIcon(tab);
  if (!tab.passProps) {
    tab.passProps = params.passProps;
  }

  adaptTopTabs(tab, tab.navigatorID);

  tab.screenId = tab.screen;

  let newtab = adaptNavigationStyleToScreenStyle(tab);
  newtab = adaptNavigationParams(tab);
  newtab.overrideBackPress = tab.overrideBackPress;
  newtab.timestamp = Date.now();
  return newtab;
}

function addTabIcon(tab) {
  if (tab.icon) {
    // const icon = resolveAssetSource(tab.icon);
    // if (icon) {
    //   tab.icon = icon.uri;
    // }

    tab.icon = resolveAssetSourceUri(tab.icon);
  }

  if (!tab.icon) {
    throw new Error('No icon defined for tab ' + tab.screen);
  }

  // change icon when tabbottom is selected
  if (tab.selectedIcon) {
    tab.selectedIcon = resolveAssetSourceUri(tab.selectedIcon);
  }
}

function convertAnimationType(animationType) {
  return animationType !== 'none';
}

function navigatorSetButtons(navigator, navigatorEventID, _params) {
  const params = _.cloneDeep(_params);
  if (params.rightButtons) {
    params.rightButtons.forEach(function(button) {
      button.enabled = !button.disabled;
      if (button.icon) {
        // const icon = resolveAssetSource(button.icon);
        // if (icon) {
        //   button.icon = icon.uri;
        // }
        button.icon = resolveAssetSourceUri(button.icon);
      }
      if (button.buttonColor) {
        button.color = processColor(button.buttonColor);
      }
      if (button.component) {
        const passPropsKey = _.uniqueId('customButtonComponent');
        PropRegistry.save(passPropsKey, button.passProps);
        button.passProps = { passPropsKey };
      }
    });
  }
  let leftButton = getLeftButton(params);
  if (leftButton) {
    if (leftButton.icon) {
      // const icon = resolveAssetSource(leftButton.icon);
      // if (icon) {
      //   leftButton.icon = icon.uri;
      // }
      leftButton.icon = resolveAssetSourceUri(leftButton.icon);
    }
    if (leftButton.buttonColor) {
      leftButton.color = processColor(leftButton.buttonColor);
    }
  } else if (shouldRemoveLeftButton(params)) {
    leftButton = {};
  }
  const fab = getFab(params);
  newPlatformSpecific.setScreenButtons(
    navigator.screenInstanceID,
    navigatorEventID,
    params.rightButtons,
    leftButton,
    fab
  );
}

function shouldRemoveLeftButton(params) {
  return params.leftButtons && params.leftButtons.length === 0;
}

function navigatorSetTabBadge(navigator, params) {
  const badge = params.badge ? params.badge.toString() : '';
  if (params.tabIndex >= 0) {
    newPlatformSpecific.setBottomTabBadgeByIndex(params.tabIndex, badge);
  } else {
    newPlatformSpecific.setBottomTabBadgeByNavigatorId(
      navigator.navigatorID,
      badge
    );
  }
}

function navigatorSetTabButton(navigator, params) {
  if (params.icon) {
    // const icon = resolveAssetSource(params.icon);
    // if (icon) {
    //   params.icon = icon.uri;
    // }

    params.icon = resolveAssetSourceUri(params.icon);
  }
  params.navigationParams = {};
  if (params.tabIndex >= 0) {
    newPlatformSpecific.setBottomTabButtonByIndex(params.tabIndex, params);
  } else {
    newPlatformSpecific.setBottomTabButtonByNavigatorId(
      navigator.navigatorID,
      params
    );
  }
}

function navigatorSetTitle(navigator, params) {
  newPlatformSpecific.setScreenTitleBarTitle(
    navigator.screenInstanceID,
    params.title
  );
}

function navigatorSetSubtitle(navigator, params) {
  newPlatformSpecific.setScreenTitleBarSubtitle(
    navigator.screenInstanceID,
    params.subtitle
  );
}

function navigatorSetStyle(navigator, params) {
  const style = convertStyleParams(params);
  newPlatformSpecific.setScreenStyle(navigator.screenInstanceID, style);
}

function navigatorSwitchToTab(navigator, params) {
  if (params.tabIndex >= 0) {
    newPlatformSpecific.selectBottomTabByTabIndex(params.tabIndex);
  } else {
    newPlatformSpecific.selectBottomTabByNavigatorId(navigator.navigatorID);
  }
}

function navigatorSwitchToTopTab(navigator, params) {
  if (params.tabIndex >= 0) {
    newPlatformSpecific.selectTopTabByTabIndex(
      navigator.screenInstanceID,
      params.tabIndex
    );
  } else {
    newPlatformSpecific.selectTopTabByScreen(navigator.screenInstanceID);
  }
}

function navigatorToggleDrawer(navigator, params) {
  const animated = !(params.animated === false);
  if (params.to) {
    const visible = params.to === 'open';
    newPlatformSpecific.setSideMenuVisible(animated, visible, params.side);
  } else {
    newPlatformSpecific.toggleSideMenuVisible(animated, params.side);
  }
}

function navigatorSetDrawerEnabled(navigator, params) {
  newPlatformSpecific.setSideMenuEnabled(params.enabled, params.side);
}

function navigatorToggleNavBar(navigator, params) {
  const screenInstanceID = navigator.screenInstanceID;
  const visible = params.to === 'shown' || params.to === 'show';
  const animated = !(params.animated === false);

  newPlatformSpecific.toggleTopBarVisible(screenInstanceID, visible, animated);
}

function navigatorToggleTabs(navigator, params) {
  const visibility = params.to === 'hidden';
  const animated = !(params.animated === false);
  newPlatformSpecific.toggleBottomTabsVisible(visibility, animated);
}

function showModal(params) {
  addNavigatorParams(params);
  addNavigatorButtons(params);
  addTitleBarBackButtonIfNeeded(params);
  addNavigationStyleParams(params);

  /*
   * adapt to new API
   */
  adaptTopTabs(params, params.navigatorID);
  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.overrideBackPress = params.overrideBackPress;
  adapted.timestamp = Date.now();
  if (!adapted.passProps) {
    adapted.passProps = {};
  }
  if (!adapted.passProps.commandType) {
    adapted.passProps.commandType = 'ShowModal';
  }

  newPlatformSpecific.showModal(adapted);
}

function showLightBox(params) {
  params.navigationParams = {};
  addNavigatorParams(params.navigationParams);
  params.screenId = params.screen;
  const backgroundBlur = _.get(params, 'style.backgroundBlur');
  const backgroundColor = _.get(params, 'style.backgroundColor');
  if (backgroundColor) {
    params.backgroundColor = processColor(backgroundColor);
  } else {
    if (backgroundBlur === 'dark') {
      params.backgroundColor = processColor('rgba(0, 0, 0, 0.5)');
    } else {
      params.backgroundColor = processColor('transparent');
    }
  }
  params.tapBackgroundToDismiss =
    _.get(params, 'style.tapBackgroundToDismiss') || false;
  newPlatformSpecific.showLightBox(params);
}

function dismissLightBox() {
  newPlatformSpecific.dismissLightBox();
}

function dismissModal(params) {
  newPlatformSpecific.dismissTopModal({
    ...params,
    navigationParams: {}
  });
}

async function dismissAllModals(params) {
  return await newPlatformSpecific.dismissAllModals();
}

function showInAppNotification(params) {
  params.navigationParams = {};
  addNavigatorParams(params.navigationParams);

  params.autoDismissTimerSec = params.autoDismissTimerSec || 5;
  if (params.autoDismiss === false) delete params.autoDismissTimerSec;

  newPlatformSpecific.showInAppNotification(params);
}

function dismissInAppNotification(params) {
  newPlatformSpecific.dismissInAppNotification(params);
}

function addNavigatorParams(screen, navigator = null, idx = '') {
  screen.navigatorID = navigator
    ? navigator.navigatorID
    : _.uniqueId('navigatorID') + '_nav' + idx;
  screen.screenInstanceID = _.uniqueId('screenInstanceID');
  screen.navigatorEventID = screen.screenInstanceID + '_events';
}

function addNavigatorButtons(screen, sideMenuParams) {
  const Screen = Navigation.getRegisteredScreen(screen.screen);
  if (screen.navigatorButtons == null) {
    screen.navigatorButtons = _.cloneDeep(Screen.navigatorButtons);
  }

  // Get image uri from image id
  let rightButtons = getRightButtons(screen);
  // override rightButtons to fix Android immutable
  if (rightButtons) {
    rightButtons = rightButtons.map(function(rightButton) {
      let button = { ...rightButton, enabled: !rightButton.disabled };
      if (button.icon) {
        // const icon = resolveAssetSource(button.icon);
        // if (icon) {
        //   button.icon = icon.uri;
        // }

        button.icon = resolveAssetSourceUri(button.icon);
      }
      if (button.buttonColor) {
        button.color = processColor(button.buttonColor);
      }
      if (button.component) {
        const passPropsKey = _.uniqueId('customButtonComponent');
        PropRegistry.save(passPropsKey, button.passProps);
        button.passProps = { passPropsKey };
      }

      return button;
    });
  }

  let leftButton = getLeftButton(screen);
  if (leftButton) {
    if (leftButton.icon) {
      // const icon = resolveAssetSource(leftButton.icon);
      // if (icon) {
      //   leftButton.icon = icon.uri;
      // }

      leftButton.icon = resolveAssetSourceUri(leftButton.icon);
    }
    if (leftButton.buttonColor) {
      leftButton.color = processColor(leftButton.buttonColor);
    }
  }

  const fab = getFab(screen);
  if (fab) {
    screen.fab = fab;
  }

  if (rightButtons) {
    screen.rightButtons = rightButtons;
  }
  if (leftButton) {
    screen.leftButton = leftButton;
  }
}

function getFab(screen) {
  let fab = screen.fab;
  if (screen.navigatorButtons && screen.navigatorButtons.fab) {
    fab = screen.navigatorButtons.fab;
  }
  if (fab === null || fab === undefined) {
    return;
  }
  if (Object.keys(fab).length === 0) {
    return {};
  }

  // const collapsedIconUri = resolveAssetSource(fab.collapsedIcon);
  const collapsedIconUri = resolveAssetSourceUri(fab.collapsedIcon);
  if (!collapsedIconUri) {
    return;
  }
  fab.collapsedIcon = collapsedIconUri;
  if (fab.expendedIcon) {
    // const expendedIconUri = resolveAssetSource(fab.expendedIcon);
    // if (expendedIconUri) {
    //   fab.expendedIcon = expendedIconUri.uri;
    // }
    fab.expendedIcon = resolveAssetSourceUri(fab.expendedIcon);
  }
  if (fab.backgroundColor) {
    fab.backgroundColor = processColor(fab.backgroundColor);
  }
  if (fab.collapsedIconColor) {
    fab.collapsedIconColor = processColor(fab.collapsedIconColor);
  }
  if (fab.expendedIconColor) {
    fab.expendedIconColor = processColor(fab.expendedIconColor);
  }

  if (fab.actions) {
    _.forEach(fab.actions, action => {
      // action.icon = resolveAssetSource(action.icon).uri;
      action.icon = resolveAssetSourceUri(action.icon);
      if (action.backgroundColor) {
        action.backgroundColor = processColor(action.backgroundColor);
      }
      if (action.iconColor) {
        action.iconColor = processColor(action.iconColor);
      }
      return action;
    });
  }

  return fab;
}

function createSideMenuButton() {
  return {
    id: 'sideMenu'
  };
}

function addTitleBarBackButtonIfNeeded(screen) {
  const leftButton = getLeftButton(screen);
  if (!leftButton) {
    screen.leftButton = {
      id: 'back'
    };
  }
}

function getLeftButton(screen) {
  const leftButton = getLeftButtonDeprecated(screen);
  if (leftButton) {
    return leftButton;
  }

  if (screen.navigatorButtons && screen.navigatorButtons.leftButtons) {
    return screen.navigatorButtons.leftButtons[0];
  }

  if (screen.leftButtons) {
    if (_.isArray(screen.leftButtons)) {
      return screen.leftButtons[0];
    } else {
      return screen.leftButtons;
    }
  }

  return null;
}

function getLeftButtonDeprecated(screen) {
  if (screen.navigatorButtons && screen.navigatorButtons.leftButton) {
    return screen.navigatorButtons.leftButton;
  }

  return screen.leftButton;
}

function getRightButtons(screen) {
  if (screen.navigatorButtons && screen.navigatorButtons.rightButtons) {
    return screen.navigatorButtons.rightButtons;
  } else if (screen.rightButtons) {
    return screen.rightButtons;
  }

  const Screen = Navigation.getRegisteredScreen(screen.screen);

  if (
    Screen.navigatorButtons &&
    !_.isEmpty(Screen.navigatorButtons.rightButtons)
  ) {
    return _.cloneDeep(Screen.navigatorButtons.rightButtons);
  }

  return null;
}

function addNavigationStyleParams(screen) {
  const Screen = Navigation.getRegisteredScreen(screen.screen);
  screen.navigatorStyle = Object.assign(
    {},
    Screen.navigatorStyle,
    screen.navigatorStyle
  );
}

function showSnackbar(params) {
  const adapted = _.cloneDeep(params);
  if (adapted.backgroundColor) {
    adapted.backgroundColor = processColor(adapted.backgroundColor);
  }
  if (adapted.actionColor) {
    adapted.actionColor = processColor(adapted.actionColor);
  }
  if (adapted.textColor) {
    adapted.textColor = processColor(adapted.textColor);
  }
  return newPlatformSpecific.showSnackbar(adapted);
}

function dismissSnackbar() {
  return newPlatformSpecific.dismissSnackbar();
}

function showContextualMenu(navigator, params) {
  const contextualMenu = {
    buttons: [],
    backButton: { id: 'back' },
    navigationParams: { navigatorEventID: navigator.navigatorEventID }
  };

  params.rightButtons.forEach((button, index) => {
    const btn = {
      icon: resolveAssetSourceUri(button.icon),
      showAsAction: button.showAsAction,
      color: processColor(button.color),
      label: button.title,
      index
    };
    // if (btn.icon) {
    //   btn.icon = btn.icon.uri;
    // }
    contextualMenu.buttons.push(btn);
  });

  newPlatformSpecific.showContextualMenu(
    navigator.screenInstanceID,
    contextualMenu,
    params.onButtonPressed
  );
}

function dismissContextualMenu() {
  newPlatformSpecific.dismissContextualMenu();
}

async function isAppLaunched() {
  return await newPlatformSpecific.isAppLaunched();
}

async function isRootLaunched() {
  return await newPlatformSpecific.isRootLaunched();
}

async function getCurrentlyVisibleScreenId() {
  return await newPlatformSpecific.getCurrentlyVisibleScreenId();
}

async function getLaunchArgs() {
  return await newPlatformSpecific.getLaunchArgs();
}

export default {
  startTabBasedApp,
  startSingleScreenApp,
  navigatorPush,
  navigatorPop,
  navigatorPopToRoot,
  navigatorPopTo,
  navigatorResetTo,
  showModal,
  dismissModal,
  dismissAllModals,
  showInAppNotification,
  showLightBox,
  dismissLightBox,
  dismissInAppNotification,
  navigatorSetButtons,
  navigatorSetTabBadge,
  navigatorSetTabButton,
  navigatorSetTitle,
  navigatorSetSubtitle,
  navigatorSetStyle,
  navigatorSwitchToTab,
  navigatorSwitchToTopTab,
  navigatorToggleDrawer,
  navigatorSetDrawerEnabled,
  navigatorToggleTabs,
  navigatorToggleNavBar,
  showSnackbar,
  dismissSnackbar,
  showContextualMenu,
  dismissContextualMenu,
  isAppLaunched,
  isRootLaunched,
  getCurrentlyVisibleScreenId,
  getLaunchArgs
};
