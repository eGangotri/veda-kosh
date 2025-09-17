import { Container } from "@mui/material";

export default function Footer() {

    return (
        <footer className="bg-gray-100 py-6 mt-8">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="font-bold text-blue-600">?</div>
                                <div className="text-sm text-gray-600">Unique Visitors</div>
                            </div>
                            <div>
                                <div className="font-bold text-blue-600">?</div>
                                <div className="text-sm text-gray-600">Page Views</div>
                            </div>
                            <div>
                                <div className="font-bold text-blue-600">?</div>
                                <div className="text-sm text-gray-600">Total Bhashya Records</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            © {new Date().getFullYear()} Aryasamaj Chennai | info.vedicscriptures@gmail.com
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 md:text-right">
                        Developed & Maintained by: eGangotri Digital Preservation Trust
                    </div>
                </div>
            </Container>
        </footer>
    )
}