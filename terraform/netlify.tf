resource "google_dns_record_set" "apex" {
  # https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/#configure-an-apex-domain
  managed_zone = data.google_dns_managed_zone.root.name
  type         = "A"
  name         = data.google_dns_managed_zone.root.dns_name
  ttl          = 3600
  # https://www.netlify.com/blog/2017/02/28/to-www-or-not-www/?_ga=2.29911423.1147613404.1590195751-1758858688.1590195751
  rrdatas = ["104.198.14.52"]
}

resource "google_dns_record_set" "www_homepage" {
  managed_zone = data.google_dns_managed_zone.root.name
  type         = "CNAME"
  name         = "www.${data.google_dns_managed_zone.root.dns_name}"
  ttl          = 3600
  rrdatas      = ["utrakr-homepage.netlify.app."]
}