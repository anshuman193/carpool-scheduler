import { describe, expect, it } from 'vitest'

import { classNames } from './classNames'

describe('classNames', () => {
  it('joins only truthy class names', () => {
    expect(classNames('base', false, undefined, 'active', null, 'rounded')).toBe('base active rounded')
  })

  it('returns an empty string when no classes are truthy', () => {
    expect(classNames('', false, null, undefined)).toBe('')
  })
})
