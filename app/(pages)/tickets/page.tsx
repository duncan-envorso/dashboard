import Image from 'next/image'
import Link from 'next/link'

export default function TicketsPage() {
    const ticketTypes = [
        {
            title: "2024 Season Tickets",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Season-Tickets2-3OgBgkgm5GukmCFFY4DFOGtl1mei8M.webp",
            alt: "2024 Tickets on sale now",
            link: "https://www.chicagohounds.com/season-tickets/"
        },
        {
            title: "Half-Season Tickets",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/halfseasonTickets-1-UEYtleVkqMecyq8TLNqY6wqlfe0z6U.webp",
            alt: "Half-Season Tickets",
            link: "https://vivenu.com/event/chicago-hounds-half-season-tickets-4ntb2b"
        },
        {
            title: "Single Game Tickets",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SingleGameTicketsHeader-0mcGkNdZ6jQR6EF2lXLcdmHZ8wQDLz.webp",
            alt: "Single Game Tickets",
            link: "https://www.chicagohounds.com/single-game-tickets/"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-100 text-foreground">
            <div className="w-full h-[50vh] relative">
                <Image
                    src="https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/11/Ticketsonsalenow.png"
                    alt="2024 Tickets on sale now"
                    fill
                    className="object-cover"
                />
            </div>
            <main className="w-full">
                {ticketTypes.map((ticket, index) => (
                    <TicketSection
                        key={index}
                        title={ticket.title}
                        image={ticket.image}
                        alt={ticket.alt}
                        link={ticket.link}
                    />
                ))}
            </main>
        </div>
    )
}

function TicketSection({ title, image, alt, link }: {
    title: string;
    image: string;
    alt: string;
    link: string;
}) {
    return (
        <div className=" h-[90vh] p-10  m-10 relative">
            <Link href={link} className=" w-full h-full">
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-contain"
                />

            </Link>
        </div>
    )
}