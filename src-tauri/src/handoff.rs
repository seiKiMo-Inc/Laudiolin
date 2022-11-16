// Implementation for HTTP handoff.
// Specifically used only for OAuth2 authentication handoff.
// This is a temporary solution until Tauri supports custom protocols.

use tiny_http::{Server, Response};
use std::thread;

/// Waits for an HTTP request on the specified port.
/// This is used for OAuth2 authentication handoff.
/// The HTTP server is killed after the first request.
pub fn handoff() {
    // Create an HTTP server.
    let server = Server::http("127.0.0.1:4956").unwrap();
    // Spawn a thread to handle the server.
    thread::spawn(move || {
        // Wait for a request.
        let request = server.recv().unwrap();
        // Process request data.
        let url = request.url();
        let code = get_code(url);

        // Validate the code.
        if code.is_some() {
            // Send a 400 response.
            let response = Response::from_string("Invalid request.")
                .with_status_code(400);
            request.respond(response).unwrap();
        } else {
            // Send a 200 response.
            let response = Response::from_string("Success.")
                .with_status_code(200);
            request.respond(response).unwrap();

            // TODO: Set the OAuth2 code in the app.

            // Kill the server.
            drop(server);
        }
    });
}

/// Parses the code from the request URL.
/// url: The URL to parse.
fn get_code(url: &str) -> Option<String> {
    // Get the code from the URL.
    let code = url.split("code=").collect::<Vec<&str>>()[1];
    // Check if the code is valid.
    if code.len() > 0 {
        Some(code.to_string())
    } else {
        None
    }
}