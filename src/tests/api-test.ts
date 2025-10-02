/**
 * Manual test script for testing the RigVeda API endpoint
 * Run this script with: npx ts-node src/tests/api-test.ts
 */

import { RigVeda } from "../types/vedas";


async function testRigVedaApi() {
  // Base URL for the API
  const baseUrl = 'http://localhost:3000/api/vedas/rigveda';
  
  // Test cases with different rishi parameters
  const testCases = [
    {
      name: 'Simple ASCII rishi parameter',
      params: { rishi: 'XYZ' },
      description: 'Testing with a simple ASCII rishi value'
    },
    {
      name: 'Unicode rishi parameter (Devanagari)',
      params: { rishi: 'वसिष्ठ' },
      description: 'Testing with Devanagari Unicode characters'
    },
    {
      name: 'Mixed rishi parameter with diacritics',
      params: { rishi: 'Madhucchandā Vaiśvāmitra' },
      description: 'Testing with Latin characters including diacritical marks'
    },
    {
      name: 'Multiple parameters including rishi',
      params: { mandal_no: '1', sukta_no: '1', rishi: 'Madhucchandā' },
      description: 'Testing with multiple parameters including rishi'
    },
    {
      name: 'Empty rishi parameter',
      params: { rishi: '' },
      description: 'Testing with an empty rishi parameter'
    },
    {
      name: 'Special characters in rishi parameter',
      params: { rishi: 'Viśvāmitra & Sons' },
      description: 'Testing with special characters in the rishi parameter'
    }
  ];

  console.log('Starting RigVeda API tests for rishi parameter...');
  console.log('=================================================');

  // Run each test case
  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);
    
    // Build URL with query parameters
    const url = new URL(baseUrl);
    Object.entries(testCase.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log(`URL: ${url.toString()}`);
    
    try {
      const response = await fetch(url.toString());
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
          
          // Check if the rishi parameter was correctly applied
          const rishiParam = testCase.params.rishi;
          if (rishiParam && rishiParam.trim() !== '') {
            const foundRishi = data.data.some((item: RigVeda) => 
              item.rishi && item.rishi.toLowerCase().includes(rishiParam.toLowerCase())
            );
            
            if (foundRishi) {
              console.log('✅ Rishi parameter correctly applied in the results');
            } else {
              console.log('❌ Rishi parameter not found in results');
            }
          }
        } else {
          console.log('No results found for this query');
        }
      } else {
        console.log(`Error: ${data.message}`);
      }
    } 
    // eslint-disable-next-line
    catch (error: any) {
      console.error(`Failed to fetch: ${error.message || 'Unknown error'}`);
    }
    
    console.log('-------------------------------------------------');
  }
  
  // Test Ashtak system parameters based on memory
  console.log('\nTesting Ashtak system parameters...');
  const ashtakTestUrl = new URL(baseUrl);
  ashtakTestUrl.searchParams.append('ashtak_no', '1');
  ashtakTestUrl.searchParams.append('adhyay_no', '1');
  ashtakTestUrl.searchParams.append('varga_no', '1');
  ashtakTestUrl.searchParams.append('mantra2_no', '1');
  
  console.log(`URL: ${ashtakTestUrl.toString()}`);
  
  try {
    const response = await fetch(ashtakTestUrl.toString());
    const data = await response.json();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log(`Success! Received ${data.data?.length || 0} results`);
      
      if (data.data && data.data.length > 0) {
        console.log('First result:');
        console.log(`- mantra_ref_id: ${data.data[0].mantra_ref_id}`);
        console.log(`- ashtak_no: ${data.data[0].ashtak_no}`);
        console.log(`- adhyay_no: ${data.data[0].adhyay_no}`);
        console.log(`- varga_no: ${data.data[0].varga_no}`);
        console.log(`- mantra2_no: ${data.data[0].mantra2_no}`);
      }
    }
  } 
  // eslint-disable-next-line
  catch (error: any) {
    console.error(`Failed to fetch: ${error.message || 'Unknown error'}`);
  }
  
  console.log('\nAll tests completed!');
}

// Run the tests
testRigVedaApi().catch(console.error);
