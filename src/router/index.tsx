import { createBrowserRouter } from 'react-router-dom';
import DuplicateCheck from '../pages/DuplicateCheck';
import BookmarkList from '../pages/BookmarkList';
import RootLayout from '../components/Layout';
import UploadPage from '../pages/UploadPage';

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <UploadPage />,
      },
      {
        path: '/bookmarks',
        element: <BookmarkList />,
      },
      {
        path: '/duplicates',
        element: <DuplicateCheck />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
