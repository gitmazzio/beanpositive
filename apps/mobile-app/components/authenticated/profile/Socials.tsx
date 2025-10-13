import Flex from "@/components/commons/Flex";
import HorizontalLine from "@/components/commons/HorizontalLine";
import StyledText from "@/components/commons/StyledText";
import { useOpenBrowser } from "@/hooks/useOpenBrowser";
import { StyleSheet, TouchableOpacity } from "react-native";

const SOCIALS = [
  {
    title: "Instagram",
    link: "https://www.instagram.com/beanpositive.app/",
    nick: "@beanpositive.app",
  },
  {
    title: "Reddit",
    link: "https://www.reddit.com/r/beanpositive",
    nick: "@beanpositive",
  },
];

export const Socials = () => {
  const { openBrowser } = useOpenBrowser();

  return (
    <Flex direction="column" style={[styles.container]}>
      {SOCIALS?.map((social, index) => {
        const isLast = index === SOCIALS.length - 1;
        return (
          <>
            <TouchableOpacity onPress={() => openBrowser(social.link)}>
              <Flex direction="row" justify="space-between" align="center">
                <Flex
                  align="center"
                  direction="row"
                  gap={12}
                  justify="space-between"
                >
                  <StyledText
                    kind="button"
                    style={{
                      fontWeight: 600,
                      color: "#3A1A10",
                    }}
                  >
                    {social.title}
                  </StyledText>
                </Flex>
                <StyledText
                  kind="button"
                  style={{
                    fontWeight: 600,
                    color: "#3A1A10",
                  }}
                >
                  {social.nick}
                </StyledText>
              </Flex>
            </TouchableOpacity>
            {!isLast && <HorizontalLine />}
          </>
        );
      })}
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCF7F0",
    padding: 12,
    borderRadius: 12,
    borderColor: "#F1D8B7",
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
