import { Composition } from "remotion";
import { TextCard } from "./compositions/TextCard";
import { textCardSchema } from "./compositions/TextCard/schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TextCard"
        component={TextCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={textCardSchema}
        defaultProps={{
          title: "Hello World",
          subtitle: "Your subtitle here",
          backgroundColor: "#1a1a2e",
          textColor: "#ffffff",
          accentColor: "#7c3aed",
        }}
      />
    </>
  );
};
