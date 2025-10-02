/**
 * Manual test script for RigVeda API endpoint with rishi parameter
 * 
 * This script can be run to test the RigVeda API endpoint with various rishi parameters,
 * including Unicode characters.
 */

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    runTests: () => Promise<void>;
  }
}

async function testRigVedaApi() {
  // Test cases with different rishi parameters
  const testCases = [
    {
      name: 'Simple ASCII rishi parameter',
      url: 'http://localhost:3000/api/vedas/rigveda?rishi=XYZ',
      expectedParam: 'XYZ'
    },
    {
      name: 'Unicode rishi parameter (Devanagari)',
      url: 'http://localhost:3000/api/vedas/rigveda?rishi=वसिष्ठ',
      expectedParam: 'वसिष्ठ'
    },
    {
      name: 'Mixed rishi parameter',
      url: 'http://localhost:3000/api/vedas/rigveda?rishi=Madhucchandā Vaiśvāmitra',
      expectedParam: 'Madhucchandā Vaiśvāmitra'
    },
    {
      name: 'Multiple parameters including rishi',
      url: 'http://localhost:3000/api/vedas/rigveda?mandal_no=1&sukta_no=1&rishi=Madhucchandā',
      expectedParam: 'Madhucchandā',
      otherParams: { mandal_no: '1', sukta_no: '1' }
    },
    {
      name: 'Empty rishi parameter',
      url: 'http://localhost:3000/api/vedas/rigveda?rishi=',
      expectedParam: ''
    }
  ];

  console.log('Starting RigVeda API tests for rishi parameter...');
  console.log('=================================================');

  // Run each test case
  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    try {
      const response = await fetch(testCase.url);
      const data = await response.json();
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`Success! Received ${data.data?.length || 0} results`);
        
        if (data.data && data.data.length > 0) {
          // Display the first result
          console.log('First result:');
          console.log(`- mantra_ref_id: ${data.data[0].mantra_ref_id}`);
          console.log(`- rishi: ${data.data[0].rishi}`);
          console.log(`- devata: ${data.data[0].devata}`);
          console.log(`- mantra (first 50 chars): ${data.data[0].mantra?.substring(0, 50)}...`);
        } else {
          console.log('No results found for this query');
        }
      } else {
        console.log(`Error: ${data.message}`);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to fetch: ${error.message || 'Unknown error'}`);
    }
    
    console.log('-------------------------------------------------');
  }
  
  console.log('\nAll tests completed!');
}

// Run the tests when the script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runTests = testRigVedaApi;
  console.log('To run tests, call window.runTests() in the browser console');
} else {
  // Node.js environment
  testRigVedaApi().catch(console.error);
}

export { testRigVedaApi };
