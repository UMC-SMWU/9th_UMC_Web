// 공용 컴포넌트 Button을 별도로 만들어서 관리

interface ButtonProps {
  onClick: () => void;
  text: string;
}

const Button = ({ onClick, text }: ButtonProps) => {
  return <button onClick={onClick}>{text}</button>;
};

export default Button;