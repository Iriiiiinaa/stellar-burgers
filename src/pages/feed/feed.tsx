import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);

  const isLoading = useSelector((state) => state.feed.isLoading);

  const handleGetFeeds = (): void => {
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
