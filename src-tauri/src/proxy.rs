use rouille::Response;
use std::thread;

/// Starts the HTTP server for proxying image requests.
pub fn start_proxy() {
    thread::spawn(|| {
        let _guard = rouille::start_server("127.0.0.1:5823", move |request| {
            let url = request.url();
            // Parse the URL to get the data between '/' and '?'.
            let path = url.split('/').collect::<Vec<&str>>();
            let path = path[1].split('?').collect::<Vec<&str>>();
            let path = path[0];

            // Get the 'from' parameter if present.
            let from = request.get_param("from");
            if from.is_none() {
                return Response::empty_404();
            }

            let from = from.unwrap();

            match from.as_str() {
                "cart" => {
                    // Adjust the URL.
                    let mut url = path.to_string();
                    let index = url.find("=w").unwrap();
                    url = url[..index].to_string();
                    url += "=w512-h512-l90-rj?from=cart";

                    // Make a request to the URL.
                    let url = format!("https://lh3.googleusercontent.com/{}", url);
                    let response = reqwest::blocking::get(url)
                        .expect("Unable to get image");

                    // Return the response.
                    Response::from_data(
                        "image/jpeg",
                        response.bytes().unwrap())
                        .with_additional_header("Cache-Control", "public, max-age=604800, immutable")
                },
                "spot" => {
                    // Make a request to the URL.
                    let path = format!("https://i.scdn.co/image/{}", path);
                    let response = reqwest::blocking::get(path)
                        .expect("Unable to get image");

                    // Return the response.
                    Response::from_data(
                        "image/jpeg",
                        response.bytes().unwrap())
                        .with_additional_header("Cache-Control", "public, max-age=604800, immutable")
                },
                "yt" => {
                    // Make a request to the URL.
                    let path = format!("https://i.ytimg.com/vi/{}/maxresdefault.jpg", path);
                    let response = reqwest::blocking::get(path)
                        .expect("Unable to get image");

                    // Return the response.
                    Response::from_data(
                        "image/jpeg",
                        response.bytes().unwrap())
                        .with_additional_header("Cache-Control", "public, max-age=604800, immutable")
                },
                _ => Response::empty_404()
            }
        });
    });
}
