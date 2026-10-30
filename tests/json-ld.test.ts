import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serializeJsonLd } from '../lib/json-ld.ts'

const hostile = '</script><script>alert(1)</script> & \u2028\u2029 <!--'

test('hostile titles cannot close the script element', () => {
  const out = serializeJsonLd({ '@type': 'ImageObject', name: hostile })
  assert.ok(!/[<>&\u2028\u2029]/.test(out))
  assert.ok(!out.toLowerCase().includes('</script'))
})

test('output is valid JSON with the original value', () => {
  const data = { name: hostile, nested: [{ a: '<b>&amp;</b>' }], n: 1 }
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data)
})

test('safe objects serialize exactly like JSON.stringify', () => {
  const data = { '@context': 'https://schema.org', url: 'https://www.wallpaperz.in/wallpaper/a-b?x=1' }
  assert.equal(serializeJsonLd(data), JSON.stringify(data))
})
