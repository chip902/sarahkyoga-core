// ProductItem.tsx
import { Card, CardBody, CardFooter, Heading, Text, Center } from "@chakra-ui/react";
import { BookNowButton } from "./BookNow";
import { Product } from "@prisma/client";

interface ProductItemProps {
	product: Product;
	quantity: number;
}

const ProductItem = ({ product }: ProductItemProps) => {
	return (
		<Card.Root>
			<Card.Body>
				<Center>
					<Card.Title>
						<Heading size="md">{product.name}</Heading>
					</Card.Title>
					<Card.Description>
						<Text>{product.description}</Text>
					</Card.Description>
					<CardFooter>
						<BookNowButton productId={product.id} />
					</CardFooter>
				</Center>
			</Card.Body>
		</Card.Root>
	);
};

export default ProductItem;
