export default interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}