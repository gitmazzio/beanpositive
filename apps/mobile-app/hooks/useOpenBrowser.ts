import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";

export interface OpenBrowserOptions {
  /**
   * Color of the toolbar. Supports React Native color formats.
   */
  toolbarColor?: string;
  /**
   * Only for iOS: Tint color for controls in SKSafariViewController.
   */
  controlsColor?: string;
  /**
   * Only for Android: Color of the secondary toolbar.
   */
  secondaryToolbarColor?: string;
  /**
   * Only for Android: Whether the browser should show the title of website on the toolbar.
   */
  showTitle?: boolean;
  /**
   * Only for Android: Whether a default share item should be added to the menu.
   */
  enableDefaultShareMenuItem?: boolean;
  /**
   * Only for Android: Whether the toolbar should be hiding when a user scrolls the website.
   */
  enableBarCollapsing?: boolean;
  /**
   * Only for iOS: Whether Safari should enter Reader mode, if it is available.
   */
  readerMode?: boolean;
  /**
   * Only for iOS: The style of the dismiss button.
   */
  dismissButtonStyle?: "done" | "close" | "cancel";
  /**
   * Only for iOS: The presentation style of the browser window.
   */
  presentationStyle?: WebBrowser.WebBrowserPresentationStyle;
  /**
   * Only for Android: Package name of a browser to be used to handle Custom Tabs.
   */
  browserPackage?: string;
  /**
   * Only for Android: Whether the browser should open in a new task or in the same task as your app.
   */
  createTask?: boolean;
  /**
   * Only for Android: Whether browsed website should be shown as separate entry in Android recents/multitasking view.
   */
  showInRecents?: boolean;
}

export interface AuthSessionOptions extends OpenBrowserOptions {
  /**
   * The URL to redirect to after authentication is complete.
   */
  redirectUrl?: string;
  /**
   * Whether to prefer the ephemeral web browser session.
   */
  preferEphemeralSession?: boolean;
  /**
   * Only for Web: Features to use with window.open().
   */
  windowFeatures?: string | WebBrowser.WebBrowserWindowFeatures;
  /**
   * Only for Web: Name to assign to the popup window.
   */
  windowName?: string;
}

export const useOpenBrowser = () => {
  /**
   * Opens a URL in the system's web browser
   */
  const openBrowser = useCallback(
    async (
      url: string,
      options?: OpenBrowserOptions
    ): Promise<WebBrowser.WebBrowserResult> => {
      try {
        const result = await WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
          ...options,
        });
        return result;
      } catch (error) {
        console.error("Error opening browser:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Dismisses the currently presented web browser
   * Only available on iOS
   */
  const dismissBrowser = useCallback(async (): Promise<void> => {
    try {
      await WebBrowser.dismissBrowser();
    } catch (error) {
      console.error("Error dismissing browser:", error);
      throw error;
    }
  }, []);

  /**
   * Warm up the browser for better performance
   * Only available on Android
   */
  const warmUpBrowser = useCallback(
    async (
      browserPackage?: string
    ): Promise<WebBrowser.WebBrowserWarmUpResult> => {
      try {
        const result = await WebBrowser.warmUpAsync(browserPackage);
        return result;
      } catch (error) {
        console.error("Error warming up browser:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Cool down the browser to free up resources
   * Only available on Android
   */
  const coolDownBrowser = useCallback(
    async (
      browserPackage?: string
    ): Promise<WebBrowser.WebBrowserCoolDownResult> => {
      try {
        const result = await WebBrowser.coolDownAsync(browserPackage);
        return result;
      } catch (error) {
        console.error("Error cooling down browser:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Get list of browsers supporting Custom Tabs
   * Only available on Android
   */
  const getCustomTabsSupportingBrowsers =
    useCallback(async (): Promise<WebBrowser.WebBrowserCustomTabsResults> => {
      try {
        const result = await WebBrowser.getCustomTabsSupportingBrowsersAsync();
        return result;
      } catch (error) {
        console.error("Error getting custom tabs supporting browsers:", error);
        throw error;
      }
    }, []);

  return {
    openBrowser,
    dismissBrowser,
    warmUpBrowser,
    coolDownBrowser,
    getCustomTabsSupportingBrowsers,
  };
};
