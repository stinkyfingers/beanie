import { useQuery, useInfiniteQuery } from 'react-query';
import * as api from './api';

const useBeanie = (token, family, name) => useQuery(['useBeanie', token, family, name], () => api.get(token, family, name));

export {
  useBeanie
};
