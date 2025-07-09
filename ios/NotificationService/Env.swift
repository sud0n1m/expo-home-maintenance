import Foundation
import CioInternalCommon

class Env {
    static var customerIOCdpApiKey: String = "${EXPO_PUBLIC_CIO_CDP_API_KEY}"
    static var customerIORegion: Region = Region.US // "us" or "eu"
}