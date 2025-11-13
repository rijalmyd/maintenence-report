import { Spinner } from "../ui/spinner";

const Loading: React.FC = () => {
  return (
    <div className="absolute w-full h-dvh bg-white flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Loading;
