
import FlipNumbers from "react-flip-numbers";
const BottomScrollCounter = ({
    prevValue,
    newValue,
    duration = 600,
    className = "",
    fontSize = "64px",
    fontWeight = "700",
    color = "inherit"
}) => {

    return (
        <div
            className={`flex items-center ${className}`}

        >
          
            <FlipNumbers
                height={32}
                width={20}
                color="black"
                background="white"
                play
                perspective={400}
                duration={duration / 1000}
                numbers={String(newValue)}
            />


        </div>
    );
};

export default BottomScrollCounter;
