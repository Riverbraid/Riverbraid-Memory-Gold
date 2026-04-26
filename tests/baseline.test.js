const fs = require('fs');
describe('Baseline Integrity', () => {
  test('Metadata Exists', () => {
    expect(fs.existsSync('./repo.role.json')).toBe(true);
  });
});
