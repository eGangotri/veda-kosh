export const RIGVEDA_SERIAL_NO = 1;
export const YAJURVEDA_SERIAL_NO = 2;
export const SAMAVEDA_SERIAL_NO = 3;
export const ATHARVA_SERIAL_NO = 4;

export const MONGO_GROUPING_QUERY_FOR_MANDALA = [
    {
        $group: {
            _id: {
                mandalaNo: "$mandal_no",
                suktaNo: "$sukta_no"
            },
            mantraCount: { $sum: 1 }
        }
    },
    {
        $group: {
            _id: "$_id.mandalaNo",
            totalMantraCount: { $sum: "$mantraCount" },
            suktaCount: { $sum: 1 },
            suktas: {
                $push: {
                    suktaNo: "$_id.suktaNo",
                    mantraCount: "$mantraCount"
                }
            },
        }
    },
    {
        $project: {
            _id: 0,
            mandalaNo: "$_id",
            suktaCount: 1,
            suktas: 1,
            totalMantraCount: 1
        }
    },
    {
        $sort: { mandalaNo: 1 }
    }
]