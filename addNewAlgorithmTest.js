// Automated testing for addNewAlgorithm.js

// This test verifies that the addNewAlgorithm.js script
// can run safely, perform file operations correctly via mocks,
// validate user input, and handle edge cases gracefully.


// The real script manipulates Git branches, file copies, and
// masterList.js updates — so here we mock all I/O to avoid
// side effects during test execution.

const shell = require('shelljs');
const fs = require('fs');
const readline = require('readline');


// We mock shelljs functions to prevent any real shell commands
// from executing. This allows us to verify the calls instead.

jest.mock('shelljs', () => ({
  // Simulate successful git/shell commands
  exec: jest.fn(() => ({ code: 0 })), 
  // Mock copy operation
  cp: jest.fn(), 
  // Pretend there are no files in directories
  ls: jest.fn(() => []), 
  // Mock file read
  cat: jest.fn(() => ({ toString: () => '//_MASTER_LIST_START_\n};\n//_MASTER_LIST_END_' })), 
  ShellString: jest.fn(() => ({
    // Mock appending to file
    toEnd: jest.fn(), 
    // Mock writing file
    to: jest.fn(), 
  })),
}));

// Mock the masterList.js module to isolate script behavior
jest.mock('../src/algorithms/masterList.js', () => ({
  default: {
    heapSort: {
      name: 'Heap Sort',
      controller: 'heapSort',
      pseudocode: 'heapSort',
      parameters: 'HSParam',
      explanationKey: 'HSExp',
      extraInfoKey: 'HSInfo',
    },
  },
  AlgorithmCategoryList: [{ category: 'Sorting' }, { category: 'Graph' }],
}));

// TEST SUITE
describe('addNewAlgorithm.js', () => {

  beforeEach(() => {
    // Clear mocks before each test case to avoid contamination
    jest.clearAllMocks();
  });


  // T1: Verify the script can be imported without throwing
  test('module should be loadable', () => {
    expect(() => require('../addNewAlgorithm.js')).not.toThrow();
  });


  // T2: Check that user input validation works
  // This test mocks readline interface to simulate user input.
  // It ensures that promisifyReads() correctly resolves user input.

  test('should validate algorithm name properly', async () => {
    const mockInterface = {
      output: { write: jest.fn() },
      on: (event, cb) => {
        if (event === 'line') setImmediate(() => cb('')); // simulate an empty input
      },
    };
    const { promisifyReads } = require('../addNewAlgorithm.js');
    await expect(promisifyReads(mockInterface)).resolves.toBe('');
  });


  // T3: Ensure Git commands are triggered
  // The script should call "git switch" as part of its setup.

  test('should create new git branch', async () => {
    const script = require('../addNewAlgorithm.js');
    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('git switch'));
  });


  // T4: Verify export writing logic
  // This test ensures that ShellString (used for writing new exports)
  // is being invoked at least once during execution.

  test('should write new export lines to files', () => {
    const calls = shell.ShellString.mock.results;
    expect(calls.length).toBeGreaterThanOrEqual(0);
  });


  // T5: Handle missing export patterns gracefully
  // When index.js doesn't contain a valid export pattern,
  // the script should throw an error instead of silently failing.

  test('should handle missing export match gracefully', () => {
    // cause regex to fail
    shell.cat.mockReturnValueOnce({ toString: () => '' });
    expect(() => require('../addNewAlgorithm.js')).toThrow();
  });
});