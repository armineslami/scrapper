import Car from "../Car";

interface CarCardProps {
  car: Car;
  onClick: (id: string) => void;
}

export default CarCardProps;
