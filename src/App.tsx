import styled from "styled-components";
import { colors } from "./styles";
import VideosView from "./components/video/VideosView";
import { SettingsProvider } from "./providers/SettingsProvider";
import { OrionProvider } from "./providers/OrionProvider";

type AppProps = {
  className?: string;
};

function App({ className }: AppProps) {
  return (
    <div className={className}>
      <SettingsProvider>
        <OrionProvider>
          <VideosView />
        </OrionProvider>
      </SettingsProvider>
    </div>
  );
}

export default styled(App)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${colors.bg0};
  * {
    box-sizing: border-box;
  }
`;
