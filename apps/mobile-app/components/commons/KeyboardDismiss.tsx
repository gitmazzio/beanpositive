import { ReactNode, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

type KeyboardDismissProps = {
  children: ReactNode;
};

export const KeyboardDismiss = ({ children }: KeyboardDismissProps) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = () => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = () => {
    setIsKeyboardVisible(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!isKeyboardVisible) {
          return;
        }

        Keyboard.dismiss();
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};
