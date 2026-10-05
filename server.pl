use strict;
use warnings;
use IO::Socket::INET;

$| = 1;
my $port = 8088;
my $server = IO::Socket::INET->new(
    LocalPort => $port,
    Listen    => 10,
    ReuseAddr => 1,
) or die "Cannot bind port $port: $!";

print "Server running on http://localhost:$port\n";

my %mime = (
    html => "text/html; charset=utf-8",
    css  => "text/css; charset=utf-8",
    js   => "application/javascript; charset=utf-8",
    png  => "image/png",
    svg  => "image/svg+xml",
    json => "application/json",
);

while (my $client = $server->accept()) {
    my $req = <$client>;
    next unless $req;
    if ($req =~ m|^GET /([^ ]*) HTTP/|) {
        my $path = $1 || 'index.html';
        $path =~ s/\?.*$//;
        $path = 'index.html' if $path eq '' || $path eq '/';
        $path =~ s/\.\.//g;
        
        if (-f $path && open my $fh, '<', $path) {
            binmode $fh;
            my $content = do { local $/; <$fh> };
            close $fh;
            my ($ext) = $path =~ /\.([^.]+)$/;
            my $type = $mime{$ext // ''} || 'text/plain';
            my $len = length($content);
            print $client "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: $type\r\nContent-Length: $len\r\nConnection: close\r\n\r\n$content";
        } else {
            my $msg = "404 Not Found";
            print $client "HTTP/1.1 404 Not Found\r\nContent-Length: 13\r\nConnection: close\r\n\r\n$msg";
        }
    }
    close $client;
}
