interface Car {
  id?: string;
  title?: string;
  milage?: string;
  price?: string;
  image?: string;
  thumbnail?: string;
  description?: string;
  details?: { title?: string; value?: string }[];
}

export default Car;
