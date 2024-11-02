// ProductItem.tsx
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Center } from "@chakra-ui/react";
import { BookNowButton } from "./BookNow";

interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
}

const ProductItem = ({ product }: { product: Product }) => {
	return (
		<Card>
			<Center>
				<CardHeader>
					<Heading size="md">{product.title}</Heading>
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
