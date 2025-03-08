import { NextRequest } from 'next/server';
import { GET } from './route';
import { addTextFilter, addNumberFilter } from '../../lib/utils';

// Mock MongoDB client
jest.mock('../../lib/utils', () => ({
  getVedaKoshaDB: jest.fn().mockResolvedValue({
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              mantra_ref_id: 'RV-1-1-1',
              mandal_no: 1,
              sukta_no: 1,
              mantra_no: 1,
              ashtak_no: 1,
              adhyay_no: 1,
              varga_no: 1,
              mantra2_no: 1,
              rishi: 'Madhucchandā Vaiśvāmitra',
              devata: 'Agni',
              chhanda: 'Gāyatrī',
              mantra: 'अग्निमीळे पुरोहितं यज्ञस्य देवं रत्वीजम् । होतारं रत्नधातमम् ॥',
              mantra_trans: 'I praise Agni, the household priest, the divine minister of the sacrifice, the invoker, who bestows treasures.'
            }
          ])
        })
      })
    }),
  }),
  addTextFilter: jest.fn(),
  addNumberFilter: jest.fn(),
  ITEM_LIMIT: 100,
  RIG_VEDA: 'rigveda'
}));

// Mock console.error to prevent error logs during tests
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('RigVeda API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case for rishi parameter
  it('should filter by rishi parameter', async () => {
    // Create mock request with rishi parameter
    const req = new NextRequest(
      new URL('http://localhost:3000/api/vedas/rigveda?rishi=XYZ')
    );

    // Call the API handler
    await GET(req);

    // Verify that addTextFilter was called with the correct parameters
    expect(addTextFilter).toHaveBeenCalledWith(
      'XYZ',
      'rishi',
      expect.any(Object)
    );
  });

  // Test case for Unicode rishi parameter
  it('should handle Unicode characters in rishi parameter', async () => {
    // Create mock request with Unicode rishi parameter
    const req = new NextRequest(
      new URL('http://localhost:3000/api/vedas/rigveda?rishi=वसिष्ठ')
    );

    // Call the API handler
    await GET(req);

    // Verify that addTextFilter was called with the correct parameters
    expect(addTextFilter).toHaveBeenCalledWith(
      'वसिष्ठ',
      'rishi',
      expect.any(Object)
    );
  });

  // Test case for multiple parameters including rishi
  it('should handle multiple parameters including rishi', async () => {
    // Create mock request with multiple parameters
    const req = new NextRequest(
      new URL('http://localhost:3000/api/vedas/rigveda?mandal_no=1&sukta_no=1&rishi=Madhucchandā')
    );

    // Call the API handler
    await GET(req);

    // Verify that addNumberFilter was called for numeric parameters
    expect(addNumberFilter).toHaveBeenCalledWith(
      '1',
      'mandal_no',
      expect.any(Object)
    );
    expect(addNumberFilter).toHaveBeenCalledWith(
      '1',
      'sukta_no',
      expect.any(Object)
    );

    // Verify that addTextFilter was called for rishi parameter
    expect(addTextFilter).toHaveBeenCalledWith(
      'Madhucchandā',
      'rishi',
      expect.any(Object)
    );
  });

  // Test case for URL-encoded Unicode rishi parameter
  it('should handle URL-encoded Unicode characters in rishi parameter', async () => {
    // Create mock request with URL-encoded Unicode rishi parameter
    // "वसिष्ठ" encoded as "%E0%A4%B5%E0%A4%B8%E0%A4%BF%E0%A4%B7%E0%A5%8D%E0%A4%A0"
    const req = new NextRequest(
      new URL('http://localhost:3000/api/vedas/rigveda?rishi=%E0%A4%B5%E0%A4%B8%E0%A4%BF%E0%A4%B7%E0%A5%8D%E0%A4%A0')
    );

    // Call the API handler
    await GET(req);

    // Verify that addTextFilter was called with the decoded Unicode string
    expect(addTextFilter).toHaveBeenCalledWith(
      'वसिष्ठ',
      'rishi',
      expect.any(Object)
    );
  });

  // Test case for empty rishi parameter
  it('should handle empty rishi parameter', async () => {
    // Create mock request with empty rishi parameter
    const req = new NextRequest(
      new URL('http://localhost:3000/api/vedas/rigveda?rishi=')
    );

    // Call the API handler
    await GET(req);

    // Verify that addTextFilter was called with empty string
    expect(addTextFilter).toHaveBeenCalledWith(
      '',
      'rishi',
      expect.any(Object)
    );
  });
});
