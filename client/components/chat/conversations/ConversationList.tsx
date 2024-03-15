import { hideScrollbar } from "@/chakra/theme";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";

type Props = {
  session: Session;
};

function ConversationList({ session }: Props) {
  const {
    data: convdata,
    error: convError,
    loading: convLoading,
  } = useQuery(conversationOperations.Queries.conversations);

  console.log({ convdata });

  return (
    <Box
      sx={{ ...hideScrollbar, padding: "10px 0px" }}
      overflowY="auto"
      w="100%"
      h="calc(100vh - 90px)"
    >
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae rerum,
        similique vitae sequi eum eius rem fuga ipsum cumque consequatur id
        dolores sapiente deleniti, vero maiores accusamus odio natus
        consequuntur doloribus alias voluptas soluta laboriosam dignissimos
        molestiae! Saepe eveniet illum dolorum, error eos eaque tempore mollitia
        velit enim est. Labore placeat rem ipsa at obcaecati doloribus earum
        debitis explicabo ut, saepe ipsam excepturi id deleniti, quaerat iusto
        nesciunt officiis odio distinctio voluptas aut inventore incidunt
        accusantium harum? Provident dolore quae assumenda aliquam in nisi.
        Facere dolore soluta eveniet hic aliquid voluptatibus in id ipsa optio
        molestiae voluptatem saepe, possimus perspiciatis sint accusantium
        deleniti explicabo dignissimos ratione voluptates doloribus placeat
        quisquam assumenda. Quia in libero aut? Quidem nisi reiciendis, iste
        quasi natus, quia ipsa harum minima necessitatibus, repudiandae
        exercitationem. Explicabo dolorum ut esse non quaerat ducimus tempora
        porro ipsam sunt, et ratione quod! Impedit illo rem debitis praesentium
        quod ea molestias quae exercitationem consectetur. Dolore, facilis neque
        dicta est voluptatem mollitia totam expedita a, non soluta iusto
        praesentium dolorum repellat ut vitae nesciunt distinctio repellendus
        provident dolorem quisquam aspernatur sequi eius similique. Perferendis
        a nesciunt, natus similique quo, obcaecati adipisci recusandae officiis
        temporibus enim sequi, dolore veritatis velit doloremque consequuntur
        deserunt odio esse dicta alias assumenda ex architecto laudantium
        quaerat. Optio illo autem corrupti labore dolores provident placeat
        officiis veniam perferendis hic cum, voluptas unde sequi voluptate eum
        ut consequuntur ipsa animi facilis atque rerum illum ad vitae
        architecto. Unde cupiditate, placeat quo sequi perspiciatis quibusdam.
        Illo incidunt fuga ab quos reiciendis atque, itaque sunt porro ratione
        beatae tempora vitae dolores qui commodi a dolorem quisquam? Sunt
        corporis facere voluptatibus ad sit, nisi laboriosam incidunt, eveniet
        quasi qui assumenda exercitationem. Impedit perferendis laudantium magni
        eius omnis fugit debitis numquam accusantium, quisquam ipsa facere
        sapiente, ipsam fuga! Obcaecati fugiat saepe veniam repellendus
        veritatis, dolor quos minus, animi facilis porro vero placeat non,
        deserunt rem enim necessitatibus optio! Accusamus reiciendis, aliquam
        omnis delectus qui incidunt sint? Qui libero laborum neque nobis
        deleniti itaque modi quasi animi id, ab reprehenderit accusamus, vel
        illo odit ad, facilis exercitationem eum nostrum cum quas accusantium
        ipsa! Minus nesciunt illo sunt eos praesentium corrupti vel autem quidem
        quisquam perspiciatis magni soluta, laborum odit aut possimus alias sint
        suscipit facere atque, perferendis quia fuga. Aperiam nisi nesciunt
        impedit nobis consectetur sed, perferendis debitis voluptates error iste
        earum quibusdam iure eaque dolorem totam pariatur fuga deleniti ipsam,
        fugiat fugit vitae architecto magni perspiciatis voluptatum! Minus
        accusamus et a modi, eveniet veritatis expedita porro libero ut ab.
        Veritatis minus at, expedita quas ipsa ut, ducimus repudiandae vero id
        reiciendis cupiditate voluptatem quibusdam ipsum sed tempore, sapiente
        nam doloremque. Voluptatem laborum suscipit, enim totam recusandae quis
        sapiente quos quam. Earum modi nulla sequi quis atque cumque, officia
        accusamus. Voluptatum, perspiciatis porro amet deserunt vel adipisci
        tenetur accusamus ipsa odio ullam. Harum totam, maxime repellendus,
        veniam quos suscipit recusandae debitis aut ab saepe soluta expedita
        quam animi a tenetur corrupti. Rem quod explicabo, amet labore sit ipsam
        modi officiis. Natus culpa reprehenderit rerum mollitia ex enim, eius,
        ut beatae, saepe voluptatibus ipsum ratione quisquam at explicabo
        molestiae molestias necessitatibus. Sit culpa possimus dolore alias.
        Minima voluptatem earum accusamus, consequuntur soluta cupiditate magnam
        laborum molestias aspernatur nostrum natus aliquid dolorem officiis
        ratione, doloribus beatae itaque? Necessitatibus, vero sed molestiae sit
        accusamus dolores delectus facilis dolore eos praesentium autem nulla
        cupiditate placeat provident recusandae, sint deleniti cumque animi amet
        esse impedit ea modi accusantium. Quis libero consectetur ipsam cumque
        numquam perspiciatis error iusto iure nemo recusandae. Incidunt nisi
        labore culpa fugiat a voluptas facilis quaerat beatae quisquam
        voluptatem ducimus maiores, in animi magni asperiores voluptatibus
        doloribus, eos soluta laboriosam iste saepe itaque. Tenetur esse ullam
        eligendi, necessitatibus modi fugiat quasi voluptas explicabo commodi
        officiis pariatur perspiciatis consequatur, quibusdam voluptatem magnam
        nam quis harum illum inventore corporis tempora eos? Iure sed soluta aut
        pariatur amet eos totam inventore repudiandae, alias sunt quasi
        reiciendis accusamus sit dolorum similique deserunt quidem consequatur
        corporis vel temporibus id beatae non praesentium! Accusamus vel eaque
        tempora, delectus consectetur quia minima dolores magni. Quibusdam
        minima excepturi culpa voluptatibus quas eveniet libero fuga, aut
        aliquam quia modi reprehenderit alias velit optio facilis! Minus
        dignissimos in fugit quidem sunt atque maxime, eos tempora, ipsa
        distinctio saepe a itaque enim amet accusantium omnis. Veritatis, atque
        suscipit non assumenda quibusdam asperiores magnam nesciunt expedita
        voluptatem, saepe vero odio voluptate aliquid adipisci tenetur sit
        mollitia sapiente dolores? Optio obcaecati reprehenderit repellendus
        facere. Voluptatum ducimus quibusdam ipsam cumque deleniti. Maxime
        impedit expedita id doloremque quos at veniam natus ipsam debitis
        assumenda? Laborum, blanditiis, veniam laudantium eius incidunt id quas
        architecto, eaque ex dolore ullam molestias? Beatae quaerat aut veniam?
        Ut dolores fugiat deserunt laudantium consequuntur libero natus dolor
        facilis quam inventore in vitae doloribus, numquam fugit labore, dolorum
        blanditiis dignissimos temporibus. Laudantium distinctio odit sed fuga
        ipsam veritatis voluptatibus maxime, quod accusantium quisquam fugit
        laboriosam odio perspiciatis ad porro illum voluptatum libero ratione.
        Velit porro ut nihil! Nam debitis atque ea accusamus nemo numquam enim
        eos voluptas veritatis, illum, vitae at minus voluptate accusantium.
        Velit facilis non maiores? Iure, recusandae. Ab illo provident quae
        facilis sed aut, consectetur recusandae unde quidem est similique
        maiores maxime quis at fuga et eveniet, voluptatibus nihil dolor
        aspernatur, nisi dignissimos veniam assumenda eos! Porro, ut dolor odio
        repellat reiciendis facere ducimus, odit assumenda voluptatem in
        excepturi quidem earum culpa accusamus numquam non! Perspiciatis, nihil
        asperiores? Quia, vero itaque dolores ipsam iusto alias voluptas
        voluptate facere necessitatibus culpa quos rerum aspernatur pariatur.
        Doloremque odit natus mollitia dignissimos et molestias deleniti
        maiores, quibusdam debitis nihil tempore corporis, beatae expedita
        atque! Modi et dolorum atque inventore quod quo, animi libero est ad
        incidunt nobis sit molestiae ipsa at, qui adipisci amet omnis blanditiis
        laudantium. Suscipit adipisci, corrupti doloremque vitae ipsum ea quae
        eligendi nobis similique nulla, veritatis reiciendis modi dolores
        placeat minus excepturi perferendis aperiam ducimus accusantium
        voluptate fugit neque, quaerat officia voluptatum. Quidem mollitia nam
        id repellat! Illo dignissimos natus cum tenetur magnam, nobis
        perspiciatis rerum maxime repellat. Laboriosam pariatur quos eos dolore!
        Reiciendis!
      </p>
    </Box>
  );
}

export default ConversationList;
