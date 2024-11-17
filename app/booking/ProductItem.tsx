// ProductItem.tsx
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Center } from "@chakra-ui/react";
import { BookNowButton } from "./BookNow";
import { Product } from "@prisma/client";

interface ProductItemProps {
	product: Product;
	quantity: number;
}

const ProductItem = ({ product }: ProductItemProps) => {
	return (
		<Card>
			<Center>
				<CardHeader>
					<Heading size="md">{product.name}</Heading>
				</CardHeader>
				<CardBody>
					<Text>{product.description}</Text>
				</CardBody>
				<CardFooter>
					<BookNowButton productId={product.id} />
				</CardFooter>
			</Center>
		</Card>
	);
};

export default ProductItem;
