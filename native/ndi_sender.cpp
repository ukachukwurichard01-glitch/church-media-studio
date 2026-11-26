
#include <Processing.NDI.Lib.h>
#include <cstdint>
#include <iostream>
#include <vector>
#include <cstdio>
#include <fcntl.h>
#include <io.h>

static constexpr int WIDTH = 960;
static constexpr int HEIGHT = 540;
static constexpr size_t FRAME_BYTES =
    static_cast<size_t>(WIDTH) * HEIGHT * 4;

int main() {

    // CRITICAL FIX:
    // Video frames are binary data, not text.
    // Prevent Windows from treating byte 0x1A as EOF.
    if (_setmode(_fileno(stdin), _O_BINARY) == -1) {
        std::cerr << "Could not set stdin to binary mode." << std::endl;
        return 1;
    }

    if (!NDIlib_initialize()) {
        std::cerr << "NDI initialization failed. Install NDI 6 Runtime (64-bit)."
                  << std::endl;
        return 2;
    }

    NDIlib_send_create_t settings{};
    settings.p_ndi_name = "CHURCH MEDIA STUDIO";
    settings.p_groups = nullptr;
    settings.clock_video = false;
    settings.clock_audio = false;

    NDIlib_send_instance_t sender = NDIlib_send_create(&settings);

    if (!sender) {
        std::cerr << "NDIlib_send_create failed. Check NDI Runtime and network permissions."
                  << std::endl;
        NDIlib_destroy();
        return 3;
    }

    std::vector<uint8_t> pixels(FRAME_BYTES);

    NDIlib_video_frame_v2_t frame{};
    frame.xres = WIDTH;
    frame.yres = HEIGHT;
    frame.FourCC = NDIlib_FourCC_type_BGRA;
    frame.frame_rate_N = 10;
    frame.frame_rate_D = 1;
    frame.picture_aspect_ratio =
        static_cast<float>(WIDTH) / HEIGHT;
    frame.frame_format_type =
        NDIlib_frame_format_type_progressive;
    frame.timecode = NDIlib_send_timecode_synthesize;
    frame.p_data = pixels.data();
    frame.line_stride_in_bytes = WIDTH * 4;
    frame.p_metadata = nullptr;
    frame.timestamp = 0;

    std::cout << "READY: CHURCH MEDIA STUDIO" << std::endl;

    while (true) {

        size_t received = 0;

        // Accumulate data until one complete frame arrives.
        while (received < FRAME_BYTES) {

            size_t count = std::fread(
                pixels.data() + received,
                1,
                FRAME_BYTES - received,
                stdin
            );

            if (count == 0) break;

            received += count;
        }

        if (received == 0) break;

        if (received != FRAME_BYTES) {
            std::cerr
                << "Incomplete frame: received "
                << received
                << " of "
                << FRAME_BYTES
                << " bytes."
                << std::endl;
            break;
        }

        // Convert RGBA from Canvas to BGRA for NDI.
        for (size_t i = 0; i < FRAME_BYTES; i += 4) {
            uint8_t red = pixels[i];
            pixels[i] = pixels[i + 2];
            pixels[i + 2] = red;
        }

        NDIlib_send_send_video_v2(sender, &frame);
    }

    NDIlib_send_destroy(sender);
    NDIlib_destroy();

    std::cout << "STOPPED" << std::endl;

    return 0;
}
