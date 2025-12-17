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

  })
})