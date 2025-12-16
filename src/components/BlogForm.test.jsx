import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls createBlog with the correct data', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const button = screen.getByText('create')

  await user.type(inputs[0], 'Test title')
  await user.type(inputs[1], 'Test author')
  await user.type(inputs[2], 'https://testurl.com')

  await user.click(button)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'https://testurl.com'
  })
})
