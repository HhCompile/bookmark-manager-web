import { createBrowserRouter } from 'react-router-dom'
import UploadPage from '../pages/UploadPage'
import BookmarkList from '../pages/BookmarkList'
import DuplicateCheck from '../pages/DuplicateCheck'
import RootLayout from '../components/Layout'

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <UploadPage />
      },
      {
        path: '/bookmarks',
        element: <BookmarkList />
      },
      {
        path: '/duplicates',
        element: <DuplicateCheck />
      }
    ]
  }
]

const router = createBrowserRouter(routes)

export default router