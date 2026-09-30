import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import {
  createOrder,
  clearOrderModal
} from '../../services/slices/orderSlice';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

const user = useSelector(
  (state) => state.user.user
);

  const constructorItems = useSelector(
    (state) => state.burgerConstructor
  );

  const orderRequest = useSelector(
    (state) => state.order.orderRequest
  );

  const orderModalData = useSelector(
    (state) => state.order.orderModalData
  );

  const onOrderClick = (): void => {
  if (!constructorItems.bun || orderRequest) return;

  if (!user) {
    navigate('/login');
    return;
  }

  const ingredientsIds = [
    constructorItems.bun._id,
    ...constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    ),
    constructorItems.bun._id
  ];

  dispatch(createOrder(ingredientsIds));
};

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun
        ? constructorItems.bun.price * 2
        : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};