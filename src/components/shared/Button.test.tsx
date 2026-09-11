import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('renders children and applies the variant classes', () => {
    render(<Button variant="success">Create group</Button>)

    const button = screen.getByRole('button', { name: 'Create group' })
    expect(button).toHaveClass('bg-success')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('supports full width and click handlers', () => {
    const onClick = vi.fn()

    render(
      <Button fullWidth variant="secondary" onClick={onClick}>
        Open details
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Open details' })
    fireEvent.click(button)

    expect(button).toHaveClass('w-full')
    expect(button).toHaveClass('bg-surface-alt')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
