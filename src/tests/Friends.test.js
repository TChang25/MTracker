const getFriendCount = require('../getFriendCount');

test('There are friends in the list, should return 4', () => {
  expect(getFriendCount()).toBe(4);
});

// comment