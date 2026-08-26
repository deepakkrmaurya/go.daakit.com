import SlotCounter from "react-slot-counter";
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
            {/* {paddedNew.map((digit, i) =>
        paddedPrev[i] === digit ? (
          <span
            key={i}
            className="inline-block"
            style={{ width: '0.6em', textAlign: 'center' }}
          >
            {digit}
          </span>
        ) : (
          <span
            key={i}
            style={{ width: '0.6em', display: 'inline-block', textAlign: 'center' }}
          >
            <SlotCounter
              value={digit}
              duration={duration}
              direction="up"
              animateUnchanged={false}
              charClassName="inline-block"
              aria-hidden="false"
            />

          </span>
        )
      )} */}
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
