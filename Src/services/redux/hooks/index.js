import {useDispatch, useSelector, useStore} from 'react-redux';

// You can't use `withTypes` in JavaScript, so just use the hooks directly
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
