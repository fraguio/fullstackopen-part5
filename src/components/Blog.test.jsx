
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('show title and author, but neither URL nor likes by default', () => {
  const blog = {
    title: 'Testing React',
    author: 'Ada Lovelace',
    url: 'http://example.com',
    likes: 10,
    user: {
      id: '1',
      username: 'ada',
    },
  }

  const user = {
    id: '1',
    username: 'ada',
  }

  render(
    <Blog blog={blog} user={user} setBlogs={() => {}} />
  )

  // título y autor visibles
  const summary = screen.getByText('Testing React Ada Lovelace')

  expect(summary).toBeInTheDocument()

  // detalles NO visibles por defecto
  const details = screen.queryByText('http://example.com')
  expect(details).toBeNull()

  const likes = screen.queryByText(/likes/i)
  expect(likes).toBeNull()
})

test('show URL and likes when clicking the view button', async () => {
  const blog = {
    title: 'Testing React',
    author: 'Ada Lovelace',
    url: 'http://example.com',
    likes: 10,
    user: {
      id: '1',
      username: 'ada',
    },
  }

  const user = {
    id: '1',
    username: 'ada',
  }

  render(
    <Blog blog={blog} user={user} setBlogs={() => {}} />
  )

  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()

  const userEventInstance = userEvent.setup()
  const button = screen.getByText('view')
  await userEventInstance.click(button)

  expect(screen.getByText('http://example.com')).toBeInTheDocument()
  expect(screen.getByText(/likes/i)).toBeInTheDocument()

})
