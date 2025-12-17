import { test, expect, beforeEach, describe } from '@playwright/test'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'testuser',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('testuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('log in to application')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('testuser logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()

      await page.getByTestId('title').fill('Playwright blog')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Playwright blog Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // create blog
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByTestId('title').fill('Likeable blog')
      await page.getByTestId('author').fill('Tester')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      // open the blog
      await page.getByRole('button', { name: 'view' }).click()

      const likesBefore = Number(
        await page.getByTestId('likes-count').innerText()
      )

      // like
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByTestId('likes-count'))
        .toHaveText(String(likesBefore + 1))
    })

    test('the user who added the blog can delete it', async ({ page }) => {
      // create blog
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByTestId('title').fill('Blog to delete')
      await page.getByTestId('author').fill('Delete Tester')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      // open the blog
      await page.getByRole('button', { name: 'view' }).click()

      // register the handler (listener) BEFORE the click
      page.on('dialog', dialog => dialog.accept())

      // click on Delete (this triggers the confirm that executes the callback dialog.accept())
      await page.getByRole('button', { name: 'Delete' }).click()

      // check that the blog no longer exists
      await expect(
        page.getByText('Blog to delete Delete Tester')
      ).not.toBeVisible()
    })

    test('only the creator can see the delete button on a blog, no one else', async ({ page, request }) => {
      // create blog
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByTestId('title').fill('New blog')
      await page.getByTestId('author').fill('Blog owner')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      // open the blog
      await page.getByRole('button', { name: 'view' }).click()

      // check delete button is not visible
      await expect(
        page.getByRole('button', { name: 'Delete' })
      ).toBeVisible()

      // logout
      await page.getByRole('button', { name: 'logout' }).click()

      // create second user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'password'
        }
      })

      // login as second user
      await page.getByTestId('username').fill('anotheruser')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'Login' }).click()

      // open the blog
      await page.getByRole('button', { name: 'view' }).click()

      // check delete button is not visible
      await expect(
        page.getByRole('button', { name: 'Delete' })
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes in descending order', async ({ page }) => {
      const createBlog = async (title) => {
        await page.getByRole('button', { name: 'Create new blog' }).click()
        await page.getByTestId('title').fill(title)
        await page.getByTestId('author').fill('Author')
        await page.getByTestId('url').fill('http://example.com')
        await page.getByRole('button', { name: 'create' }).click()
      }

      await createBlog('First blog')
      await createBlog('Second blog')
      await createBlog('Third blog')

      const getBlog = (title) =>
        page.locator('.blog', { hasText: title })

      const getLikeButton = (blogTitle) =>
        getBlog(blogTitle).getByRole('button', { name: 'like' })

      // First blog -> 1 like
      await getBlog('First blog').getByRole('button', { name: 'view' }).click()
      let likeButton = getLikeButton('First blog')
      await likeButton.click()

      // Second blog -> 2 likes
      await getBlog('Second blog').getByRole('button', { name: 'view' }).click()
      likeButton = getLikeButton('Second blog')
      await likeButton.click()
      await likeButton.click()

      // Third blog -> 3 likes
      await getBlog('Third blog').getByRole('button', { name: 'view' }).click()
      likeButton = getLikeButton('Third blog')
      await likeButton.click()
      await likeButton.click()
      await likeButton.click()

      // leer orden final del DOM
      const likes = await page.locator('.blog').evaluateAll(blogs =>
        blogs.map(blog =>
          Number(blog.querySelector('[data-testid="likes-count"]').textContent)
        )
      )

      expect(likes).toEqual([...likes].sort((a, b) => b - a))
    })
  })
})