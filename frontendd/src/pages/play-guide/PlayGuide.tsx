import Nav from "../../components/Nav";

const PlayGuide = () => {
  const cardContents = [
    {
      num: "01",
      title: "choose a category",
      text: "To start playing, you need to connect your wallet. Click the 'Connect Wallet' button on the navigation bar and follow the prompts to authorize the connection. This will allow you to participate in the game and track your progress.",
    },
    {
      num: "02",
      title: "set username",
      text: "Select a unique username to set up your points and rankings. This will help us personalize your experience and keep track of your achievements.",
    },
    {
      num: "03",
      title: "win or lose",
      text: "You win by guessing all the letters in the word before your health runs out. If the health bar empties before you guess the word, you lose.",
    },
  ];
  return (
    <div className="w-full h-full container mx-auto">
      <Nav img="/How-to-Play.svg" />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-10 mt-8">
        {cardContents.map((content, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-md  flex flex-col items-center rounded-3xl p-4"
          >
            <h2 className="text-center text-4xl text-[#2463FF]">
              0{index + 1}
            </h2>

            <div className="text-center">
              <h4 className="text-4xl text-[#261676]">{content.title}</h4>

              <p className="py-2 text-center text-2xl text-[#261676] leading-relaxed">
                {content.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayGuide;
